export default function Toast({ msg, onDone }) {
  return (
    <div
      className="toast"
      onAnimationEnd={e => e.animationName === "toastOut" && onDone()}
    >
      ✓ {msg}
    </div>
  );
}