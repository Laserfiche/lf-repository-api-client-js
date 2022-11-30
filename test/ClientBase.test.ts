import { trimEnd } from '../src/ClientBase.js';

describe('trimEnd', () => {
  test('Trim one end character', async () => {
    //Arrange
    const value = 'https://example.com/LFRepositoryAPI/';
    const endValue = '/';
    //Act
    const result = trimEnd(value, endValue);
    //Assert
    expect(result).toBe('https://example.com/LFRepositoryAPI');
  });

  test('Trim two end characters', async () => {
    //Arrange
    const value = 'https://example.com/LFRepositoryAPI/';
    const endValue = 'I/';
    //Act
    const result = trimEnd(value, endValue);
    //Assert
    expect(result).toBe('https://example.com/LFRepositoryAP');
  });

  test('Trim zero characters', async () => {
    //Arrange
    const value = 'https://example.com/LFRepositoryAPI/';
    const endValue = '';
    //Act
    const result = trimEnd(value, endValue);
    //Assert
    expect(result).toBe(value);
  });
});
