import { toast } from "sonner";
import { helloSync, useHelloSync } from "./synced-store";

function App() {
  const message = useHelloSync((state) => state.message);
  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen bg-gray-300 w-screen">
        <div className="text-3xl font-bold underline">hello world</div>

        {/* fetch button */}
        <button
          className="bg-blue-500 text-white p-2 rounded-md"
          onClick={() => {
            useHelloSync.sync.fetchRemoteState();
            toast.success("Remote state fetched");
          }}
        >
          Fetch Remote State
        </button>

        {/* render the message from the synced store */}
        <div className="text-2xl">{message}</div>

        {/* set message button */}
        <button
          className="bg-green-500 text-white p-2 rounded-md"
          onClick={() => {
            helloSync.setMessage("Hello, from the frontend!");
            toast.success("Message set");
          }}
        >
          Set Message
        </button>
      </div>
    </>
  );
}

export default App;
