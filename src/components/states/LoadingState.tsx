export default function LoadingState({ text }: { text: string }) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center space-y-5">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-gray-600">{text}</p>
      </div>
    </div>
  );
}
