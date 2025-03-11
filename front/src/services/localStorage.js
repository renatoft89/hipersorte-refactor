export const addUserLocal = (user) => {
  const {id, name, email, role, token } = user;
  
  localStorage.setItem('USER', JSON.stringify({ id, name, email, role, token }));
}