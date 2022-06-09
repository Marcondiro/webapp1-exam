const APIURL = 'http://localhost:3001/api/v1';

const login = async (credentials) => {
  const response = await fetch(APIURL + '/sessions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(credentials),
  });
  if (response.ok) {
    const user = await response.json();
    return user;
  }
  else {
    const errDetails = await response.text();
    throw errDetails;
  }
};

const logout = async (user) => {
  const response = await fetch(APIURL + `/sessions/${user.id}`, {
    method: 'DELETE',
    credentials: 'include'
  });
  return Boolean(response.ok);
};

const getCourses = async () => {
  const response = await fetch(APIURL + '/courses', {
    method: 'GET',
  });
  if (response.ok) {
    const courses = await response.json();
    return courses;
  }
  else {
    const errDetails = await response.text();
    throw errDetails;
  }
};

export { login, logout, getCourses };
