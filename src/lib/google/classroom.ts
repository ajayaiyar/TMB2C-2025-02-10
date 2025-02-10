// Use Google's client library for browser
const SCOPES = [
  'https://www.googleapis.com/auth/classroom.courses.readonly',
  'https://www.googleapis.com/auth/classroom.coursework.students',
  'https://www.googleapis.com/auth/classroom.rosters.readonly'
];

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const REDIRECT_URI = 'https://lovely-madeleine-0f8c23.netlify.app/auth/google/callback';

export class GoogleClassroomService {
  private static instance: GoogleClassroomService;
  private tokenClient: google.accounts.oauth2.TokenClient | null = null;
  private accessToken: string | null = null;

  private constructor() {
    // Initialize on first use
  }

  static getInstance(): GoogleClassroomService {
    if (!this.instance) {
      this.instance = new GoogleClassroomService();
    }
    return this.instance;
  }

  async initialize() {
    if (!this.tokenClient) {
      this.tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES.join(' '),
        callback: (response) => {
          if (response.access_token) {
            this.accessToken = response.access_token;
          }
        },
      });
    }
  }

  async authorize() {
    if (!this.tokenClient) {
      await this.initialize();
    }
    this.tokenClient?.requestAccessToken();
  }

  async getCourses() {
    if (!this.accessToken) {
      throw new Error('Not authorized');
    }

    const response = await fetch(
      'https://classroom.googleapis.com/v1/courses?courseStates=ACTIVE',
      {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch courses');
    }

    const data = await response.json();
    return data.courses || [];
  }

  async createAssignment(courseId: string, title: string, description: string, content: string) {
    if (!this.accessToken) {
      throw new Error('Not authorized');
    }

    const assignment = {
      title,
      description,
      materials: [
        {
          driveFile: {
            driveFile: {
              title,
              content
            }
          }
        }
      ],
      workType: 'ASSIGNMENT',
      state: 'PUBLISHED'
    };

    const response = await fetch(
      `https://classroom.googleapis.com/v1/courses/${courseId}/courseWork`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(assignment),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to create assignment');
    }

    return response.json();
  }
}

export const classroomService = GoogleClassroomService.getInstance();