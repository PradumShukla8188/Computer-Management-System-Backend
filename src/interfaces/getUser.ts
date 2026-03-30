interface institute {
  _id: string;
  name: string;
  subdomain: string;
}

interface role {
  _id: string;
  displayName: string;
}

export interface getUser {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: role;
  institute: institute;
}
