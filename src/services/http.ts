/**
 * Thin fetch wrapper shared by the service layer.
 *
 * The base URL still comes from the CRA-era `process.env` shim that Vite keeps
 * providing through `define`, so the services did not have to change during the
 * migration.
 */
const baseUrl = process.env.REACT_APP_API;

export const getJson = async <T>(path: string): Promise<T> => {
  const response = await fetch(`${baseUrl}${path}`);

  if (!response.ok) {
    throw new Error(`Request to ${path} failed with ${response.status}`);
  }

  return (await response.json()) as T;
};
