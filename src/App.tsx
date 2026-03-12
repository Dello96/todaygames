import AuthenticationLayer from 'AuthenticationLayer';
import Router from './shared/router';

function App() {
  return (
    <AuthenticationLayer>
      <Router />
    </AuthenticationLayer>
  );
}

export default App;
