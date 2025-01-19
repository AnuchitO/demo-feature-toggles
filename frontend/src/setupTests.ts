import '@testing-library/jest-dom';
import 'whatwg-fetch';

jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  findDOMNode: jest.fn(),
}));

