import '@testing-library/jest-dom';
//import 'whatwg-fetch'
import { TextEncoder } from 'util';

jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  findDOMNode: jest.fn(),
}));


// mock TextEncoder
global.TextEncoder = TextEncoder;

