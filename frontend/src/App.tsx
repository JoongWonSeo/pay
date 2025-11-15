import { toast } from "sonner";
import { useBackend } from "./synced-store";

function App() {
  const channels = useBackend((state) => state.channels);
  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen bg-gray-300 w-screen">
        <div className="text-3xl font-bold underline">hello world</div>

        {/* fetch button */}
        <button
          className="bg-blue-500 text-white p-2 rounded-md"
          onClick={() => {
            useBackend.sync.fetchRemoteState();
            toast.success("Remote state fetched");
          }}
        >
          Fetch Remote State
        </button>

        {/* render the message from the synced store */}
        <div className="text-2xl">
          {channels.map((channel) => channel.name).join(", ")}
        </div>
      </div>
    </>
  );
}

export default App;
