import { Unit } from './model';

function id(): number {
  return Math.floor(Math.random() * 1000);
}
export const PUSH_BASED: Unit = {
  type: 'department',
  name: 'Push-Based HQ 🏢',
  children: [
    {
      type: 'department',
      name: 'Leadership 👨‍💼',
      children: [
        {
          type: 'employee',
          name: 'Michael Hladky',
          role: 'C',
          tasks: [
            { id: id(), duration: 12 },
            { id: id(), duration: 7 },
          ],
        },
        {
          type: 'employee',
          name: 'Johanna Hladky',
          role: 'C',
          tasks: [
            { id: id(), duration: 6 },
            { id: id(), duration: 3 },
          ],
        },
        {
          type: 'employee',
          name: 'Julia Rapczynska',
          role: 'B',
          tasks: [
            { id: id(), duration: 9 },
          ],
        },
      ],
    },
    {
      type: 'department',
      name: 'Engineering 💻',
      children: [
        // First sorting: Role C & B first
        {
          type: 'employee',
          name: 'Julian Jandl',
          role: 'B',
          tasks: [
            { id: id(), duration: 5 },
            { id: id(), duration: 4 },
          ],
        },
        // Second sorting: All other roles sorted alphabetically
        {
          type: 'employee',
          name: 'Adrian Romanski',
          role: 'A',
          tasks: [
            { id: id(), duration: 8 },
          ],
        },
        {
          type: 'employee',
          name: 'Christopher Holder',
          role: 'A',
          tasks: [
            { id: id(), duration: 8 },
            { id: id(), duration: 5 },
          ],
        },
        {
          type: 'employee',
          name: 'Edouard Bozon',
          role: 'A',
          tasks: [
            { id: id(), duration: 7 },
          ],
        },
        {
          type: 'employee',
          name: 'Edouard Maleix',
          role: 'A',
          tasks: [
            { id: id(), duration: 7 },
            { id: id(), duration: 2 },
          ],
        },
        {
          type: 'employee',
          name: 'Enea Jahollari',
          role: 'A',
          tasks: [
            { id: id(), duration: 3 },
            { id: id(), duration: 6 },
          ],
        },
        {
          type: 'employee',
          name: 'Hanna Skryl',
          role: 'A',
          tasks: [
            { id: id(), duration: 2 },
            { id: id(), duration: 7 },
          ],
        },
        {
          type: 'employee',
          name: 'Kirill Karnaukhov',
          role: 'A',
          tasks: [
            { id: id(), duration: 9 },
          ],
        },
        {
          type: 'employee',
          name: 'Lars Gyrup Brink Nielsen',
          role: 'A',
          tasks: [
            { id: id(), duration: 6 },
            { id: id(), duration: 5 },
          ],
        },
        {
          type: 'employee',
          name: 'Michael Berger',
          role: 'A',
          tasks: [
            { id: id(), duration: 5 },
            { id: id(), duration: 4 },
          ],
        },
        {
          type: 'employee',
          name: 'Ondrej Svoreň',
          role: 'A',
          tasks: [
            { id: id(), duration: 4 },
            { id: id(), duration: 3 },
          ],
        },
        {
          type: 'employee',
          name: 'Vojtech Mašek',
          role: 'X',
          tasks: [
            { id: id(), duration: 3 },
            { id: id(), duration: 5 },
          ],
        },
        {
          type: 'employee',
          name: 'Manuel Matuzovic',
          role: 'X',
          tasks: [
            { id: id(), duration: 6 },
            { id: id(), duration: 3 },
            { id: id(), duration: 2 },
          ],
        },
        {
          type: 'employee',
          name: 'Maria Korneeva',
          role: 'X',
          tasks: [
            { id: id(), duration: 7 },
          ],
        },
        {
          type: 'employee',
          name: 'Stefan Baumgartner',
          role: 'X',
          tasks: [
            { id: id(), duration: 4 },
            { id: id(), duration: 5 },
          ],
        },
        {
          type: 'employee',
          name: 'Tanja Ulianova',
          role: 'X',
          tasks: [
            { id: id(), duration: 6 },
            { id: id(), duration: 3 },
          ],
        },
        {
          type: 'employee',
          name: 'Alexander Lichter',
          role: 'X',
          tasks: [
            { id: id(), duration: 8 },
          ],
        },
      ],
    },
    {
      type: 'department',
      name: 'Marketing 📢',
      children: [
        // First sorting: Role B first
        {
          type: 'employee',
          name: 'Alex Schwaiger',
          role: 'B',
          tasks: [
            { id: id(), duration: 5 },
            { id: id(), duration: 2 },
          ],
        },
        // Second sorting: Remaining roles alphabetically
        {
          type: 'employee',
          name: 'Iulia Enescu',
          role: 'A',
          tasks: [
            { id: id(), duration: 6 },
            { id: id(), duration: 3 },
          ],
        },
      ],
    },
  ],
};
