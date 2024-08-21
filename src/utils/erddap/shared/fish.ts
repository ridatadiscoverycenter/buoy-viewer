export function getAnimalFromSpecies(species: string) {
  const formattedSpecies = species.toLowerCase();
  let animal = 'fish';
  if (formattedSpecies.includes('crab')) {
    animal = 'crab';
  } else if (formattedSpecies.includes('lobster')) {
    animal = 'lobster';
  } else if (formattedSpecies.includes('squid')) {
    animal = 'squid';
  } else if (formattedSpecies.includes('sea_star')) {
    animal = 'starfish';
  }
  return animal;
}

export function getTitleFromSpecies(species: string) {
  const title = species
    .replace(/[A-Z]/g, (letter) => ` ${letter.toLowerCase()}`)
    .split(' ')
    .map((word) => `${word[0].toUpperCase()}${word.slice(1)}`)
    .join(' ');

  if (title === 'Alosa Spp') {
    return 'Alewife';
  } else if (title === 'Longhorned Sculpin') {
    return 'Longhorn Sculpin';
  } else if (title === 'Long Finned Squid') {
    return 'Longfin Squid';
  } else if (title === 'Sea Star') {
    return 'Starfish';
  } else if (title === 'Spider Crab') {
    return 'Spider Crabs';
  } else if (title === 'Windowpane') {
    return 'Windowpane Flounder';
  }
  return title;
}
