document.addEventListener('DOMContentLoaded', () => {
  const twitterButton = document.querySelector('#js-tweet');
  const spinner = document.querySelector('#js-spinner');
  const newJokeButton = document.querySelector('#js-new-joke');

  newJokeButton.addEventListener('click', getJoke);

  async function getJoke() {
    spinner.classList.remove('hidden');
    newJokeButton.disabled = true;

    try {
      const response = await fetch('/joke');
      if (!response.ok) {
        throw Error(response.statusText);
      }
      const json = await response.json();
      displayJoke(json.joke);
      setTweetButton(json.joke);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch new quote');
    } finally {
      newJokeButton.disabled = false;
      spinner.classList.add('hidden');
    }
  }

  function displayJoke(joke) {
    const jokeText = document.querySelector('#js-joke-text');
    jokeText.textContent = joke;
  }

  function setTweetButton(joke) {
    twitterButton.setAttribute(
      'href',
      `https://twitter.com/share?text=${joke}`
    );
  }
});
