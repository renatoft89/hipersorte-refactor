

const PrivateRoute = ({ component: Component, ...rest }) => {
  const token = localStorage.getItem('USER');
  
  return (
    <Route
      {...rest}
      render={props =>
        token ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

export default PrivateRoute;
