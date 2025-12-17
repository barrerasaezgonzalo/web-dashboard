export default function Player() {
  return (
    <div className="bg-gray-800 text-white p-4 rounded shadow w-full max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4 border-b pb-2">
        Radio Futuro Chile (En vivo)
      </h2>
      <audio
        src="https://playerservices.streamtheworld.com/api/livestream-redirect/FUTURO_SC"
        controls
        autoPlay={false}
        className="w-full block"
      >
        Tu navegador no soporta audio en vivo.
      </audio>
    </div>
  );
}
