import { Tags } from '../Tags';
import { tagsFactory } from '../tagsFactory';

describe('Tags', () => {
  it('should create instance via tagsFactory', () => {
    const tags = tagsFactory([['1', '2'], ['3', '3']]);
    expect(tags).toBeInstanceOf(Tags);
    const modifiedTags = tags.set('1', 'fourty');
    expect(tags.get('1')).toEqual('2');
    expect(modifiedTags.get('1')).toEqual('fourty');
  });
  it('should stringify', () => {
    const tags = tagsFactory([['1', '2'], ['3', '3']]);
    expect(JSON.stringify(tags)).toMatchSnapshot();
  });
});
