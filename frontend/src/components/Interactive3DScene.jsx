const Interactive3DScene = () => {
  return (
    <div className="w-full h-full relative flex items-center justify-center bg-transparent">
      {/* Spline Viewer Web Component */}
      <spline-viewer 
        url="https://prod.spline.design/PyzDhpQ9E5f1E3MT/scene.splinecode"
        style={{ width: '100%', height: '100%' }}
      ></spline-viewer>
    </div>
  );
};

export default Interactive3DScene;
