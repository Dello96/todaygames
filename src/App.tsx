import AuthenticationLayer from 'AuthenticationLayer';
import Router from './shared/Router';

function App() {
  return (
    <AuthenticationLayer>
      <Router />
    </AuthenticationLayer>
  );
}

export default App;
//마무리
