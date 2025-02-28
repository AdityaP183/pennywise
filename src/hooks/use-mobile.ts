export default function useMobile() {
	const isMobile = window.matchMedia("(max-width: 768px)").matches;
	return isMobile;
}
