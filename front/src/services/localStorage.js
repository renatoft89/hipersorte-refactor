export const addUserLocal = (user) => {
  const { name, email, role, token } = user;
  
  localStorage.setItem('USER', JSON.stringify({ name, email, role, token }));
}