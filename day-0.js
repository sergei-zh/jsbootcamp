function countWordStatistic(originalString) {
	var filteredString = originalString.replace(/[\.\,\(\)\:\;\!\?\n]/g, ' ');
	var compactedString = filteredString.replace(/\s+/g, ' ');
	var trimmedString = compactedString.trim();

	var wordsCountBySize = [];
	var totalWordsCount = 0;

	var words = trimmedString.split(' ');

	words.forEach(function(word) {
        var len = word.length;
        wordsCountBySize[len] = wordsCountBySize[len] + 1 || 1;
        totalWordsCount++;
	});

	for (var size in wordsCountBySize) {
		var count = wordsCountBySize[size];
		var percentage = ((count / totalWordsCount) * 100).toFixed(1);
		console.log('' + size + ' letter(s) : ' + count + ' word(s) (' + percentage + '%)')
	}
}

countWordStatistic('Hello World');
console.log();
countWordStatistic('Hi,hi, !! \n World');
