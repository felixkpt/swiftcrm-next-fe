import { runBuilderSeeder } from '../model-builder/Module/utils/modelGenerator';
import ClientActions from './ClientActions';

const page = () => {

  return (
    <div>
      <ClientActions runBuilderSeeder={runBuilderSeeder} />
    </div>
  );
}

export default page;
