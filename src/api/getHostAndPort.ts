export default function getHostAndPort() {
  return localStorage.getItem("hostAndPort") || "localhost:8000";
}
