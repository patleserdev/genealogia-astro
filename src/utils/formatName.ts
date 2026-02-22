export function capitalizeFirst(str: string = ""): string {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }
  
  export function formatFullName(prenom: string, nom: string) {
    return `${capitalizeFirst(prenom)} ${capitalizeFirst(nom)}`;
  }