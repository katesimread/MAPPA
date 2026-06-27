export const roundCoordinates = (coordinates, decimal_points = 6) => {
  return coordinates.map((coord) => parseFloat(coord.toFixed(decimal_points)));
};
