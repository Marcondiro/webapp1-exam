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
  } else if (response.status === 401) {
    return null;
  } else {
    const errDetails = await response.text();
    throw errDetails;
  }
};

const logout = async (user) => {
  const response = await fetch(APIURL + `/sessions/${user.id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (response.ok) {
    return true;
  } else {
    const errDetails = await response.text();
    throw errDetails;
  }
};

const getCourses = async () => {
  const response = await fetch(APIURL + '/courses', {
    method: 'GET',
  });
  if (response.ok) {
    const courses = await response.json();
    return courses;
  } else {
    const errDetails = await response.text();
    throw errDetails;
  }
};

const getStudyPlan = async (user) => {
  const response = await fetch(APIURL + '/studyPlans/' + user.id, {
    method: 'GET',
    credentials: 'include',
  });
  if (response.ok) {
    const courses = await response.json();
    return courses;
  } else if (response.status === 404) {
    return null;
  } else {
    const errDetails = await response.text();
    throw errDetails;
  }
};

const createStudyPlan = async (studyPlan) => {
  const response = await fetch(APIURL + '/studyPlans', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(studyPlan),
  });
  if (response.ok) {
    return true;
  } else {
    const errDetails = await response.text();
    throw errDetails;
  }
}

const updateStudyPlan = async (user, studyPlan) => {
  const response = await fetch(APIURL + `/studyPlans/${user.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(studyPlan),
  });
  if (response.ok) {
    return true;
  } else {
    const errDetails = await response.text();
    throw errDetails;
  }
}


const deleteStudyPlan = async (user) => {
  const response = await fetch(APIURL + '/studyPlans/' + user.id, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (response.ok) {
    return true;
  } else {
    const errDetails = await response.text();
    throw errDetails;
  }
};

export { login, logout, getCourses, getStudyPlan, createStudyPlan, updateStudyPlan, deleteStudyPlan };
