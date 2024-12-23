import { Monthly } from "./_components/monthly";
import { Stage } from "./_components/stage";
import { Thana } from "./_components/thana";

const Home = () => {
  return (
    <main className="w-full h-screen grid grid-cols-2 gap-4 p-4">
      <Stage />
      <Monthly />
      <Thana />
    </main>
  );
};

export default Home;
