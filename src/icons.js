import L from 'leaflet';
import friendlyBigFlagIconUrl from './icons/friendly-big-flag.png';
import friendlySmallFlagIconUrl from './icons/friendly-small-flag.png';
import friendlyJailIconUrl from './icons/friendly-jail.png';
import enemyBigFlagIconUrl from './icons/enemy-big-flag.png';
import enemySmallFlagIconUrl from './icons/enemy-small-flag.png';
import enemyJailIconUrl from './icons/enemy-jail.png';

export const icons = {
  friendly: {
    Big_Flag: L.icon({
      iconUrl: friendlyBigFlagIconUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    }),
    Small_Flag: L.icon({
      iconUrl: friendlySmallFlagIconUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    }),
    Jail: L.icon({
      iconUrl: friendlyJailIconUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    }),
  },
  enemy: {
    Big_Flag: L.icon({
      iconUrl: enemyBigFlagIconUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    }),
    Small_Flag: L.icon({
      iconUrl: enemySmallFlagIconUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    }),
    Jail: L.icon({
      iconUrl: enemyJailIconUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    }),
  },
};
