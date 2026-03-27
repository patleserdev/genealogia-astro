function capitalizeFirst(str = "") {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
function formatFullName(prenom, nom) {
  return `${capitalizeFirst(prenom)} ${capitalizeFirst(nom)}`;
}

export { formatFullName as f };
