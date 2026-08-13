export default function Logo({ className = "" }) {
    return (
        <img
            src="/logo.svg"
            alt="Pennywise"
            className={`object-contain ${className}`}
        />
    );
}
