const extractVehicleIdFromPath = (path: string): string | null => {
  const match = path.match(/\/dashboard\/([^/]+)/);
  return match ? match[1] : null;
};

export default extractVehicleIdFromPath;
