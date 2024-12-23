import { Monthly } from "./_components/monthly";
import { Stage } from "./_components/stage";
import { Thana } from "./_components/thana";
import { Threemonth } from "./_components/three";

const Home = () => {
  return (
    <main className="w-full h-screen p-4">
      <div className="flex gap-x-4">
        <Stage />
        <Threemonth />
      </div>
      <div className="flex gap-x-4 mt-4">
        <Thana />
        <Monthly />
      </div>
    </main>
  );
};

export default Home;
