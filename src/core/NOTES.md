### Handle set differences
  The idea is that whenever we are doing entities.subtract, we probably know the answer, because we are the ones who mutated it in the first place.
  If possible we could extend the Set and use heavy memoization to figure it out. :)

  ### better typing

  https://gist.github.com/HeyImAlex/099922105b83bacfb69a30989e1fa086