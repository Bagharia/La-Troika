import ApiTester from '../components/ApiTester';
import TestNavbar from '../components/TestNavbar';

const ApiTestPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <TestNavbar />
      <ApiTester />
    </div>
  );
};

export default ApiTestPage;
