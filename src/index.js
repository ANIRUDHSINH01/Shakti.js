class Plugins { 
   constructor(args) { 
     this.args = args; 
     if (!args.bot) { 
       console.log("You have not inpputted your aoi client! Exiting Code!"); 
       process.exit(0); 
     } 
   } 
loadPlugins() { 

const bot = this.args.bot; 

bot.functionManager.createFunction({ 
       name: '$botOwnerID', 
       params: [""], 
       type: 'aoi.js', 
       code: `$clientOwnerIDs` 
     });

bot.functionManager.createFunction({
    name: "$commandExists",
    type: "djs",
    code: async function (d) {
        const data = d.util.aoiFunc(d);
        const [name, type] = data.inside.splits;
        if (!name)
            return d.aoiError.fnError(d, "custom", {}, "Missing command name in");
        if (!d.client.cmd.types.includes(type))
            return d.aoiError.fnError(d, "custom", {}, "Invalid command type provided in");
        data.result = d.client.cmd[type].some(x => x.name.toLowerCase() === name.toLowerCase());
        return {
            code: d.util.setCode(data)
        }
    }
});
   
bot.functionManager.createFunction({
  name: "$fileNames",
  type: "djs",
  code: async (d) => {
    const data = d.util.aoiFunc(d);
    const [category, separator = ", "] = data.inside.splits;
    
    const fs = require('fs');
    const path = require('path');
    const folderPath = path.join(__dirname, 'commands', category);
    
    let files = [];
    let output = '';
    
    try {
      files = fs.readdirSync(folderPath);
      output = files
        .filter((file) => file !== '$alwaysExecute.js')
        .map((file) => path.parse(file).name)
        .join(separator);
    } catch (err) {
      output = `Error reading folder ${folderPath}: ${err}`;
    }
    
    data.result = output;
    
    return { code: d.util.setCode(data) };
  }
});

bot.functionManager.createFunction({
  name: `$isFileEmpty`,
  type: "djs",
  code: async d => {
    const data = d.util.aoiFunc(d);
    const [filePath] = data.inside.splits;

    const isFileEmpty = filePath => {
      try {
        const stats = fs.statSync(filePath);
        return stats.size === 0;
      } catch (error) {
        // Handle file not found or other errors
        console.error('Error:', error);
        return false;
      }
    }

    data.result = isFileEmpty(filePath);

    return {
      code: d.util.setCode(data)
    };
  }
});

bot.functionManager.createFunction({
  name: "$emojiProgressBar",
  type: "djs",
  code: async (d) => {
  const data = d.util.aoiFunc(d);
  const [fullStart, emptyStart, fullBar, emptyBar, fullEnd, emptyEnd, value, maxValue, size] = data.inside.splits;

let errors = []

!fullStart || fullStart == '' ? errors.push('"fullStart" - Param 1 is not provided!') : !emptyStart || emptyStart == '' ? errors.push('"emptyStart" - Param 2 is not provided!') : !fullBar || fullBar == '' ? errors.push('"fullBar" - Param 3 is not provided!') : !emptyBar || emptyBar == '' ? errors.push('"emptyBar" - Param 4 is not provided!') : !fullEnd || fullEnd == '' ? errors.push('"fullEnd" - Param 5 is not provided!') : !emptyEnd || emptyEnd == '' ? errors.push('"emptyEnd" - Param 6 is not provided!') : !size || size == '' || parseInt(size) < 10 ? errors.push('"size" cannot be less than 10 or empty') : null

console.log(errors)
if(errors.length >= 1) {
 data.result = errors.join('\n')
} else {

let barArr = [];
let full = Math.round(size * (value / maxValue > 1 ? 1 : value / maxValue));
let empty = size - full > 0 ? size - full : 0;
for (let i = 1; i <= full; i++) barArr.push(fullBar);
for (let i = 1; i <= empty; i++) barArr.push(emptyBar);
barArr[0] = barArr[0] == fullBar ? fullStart : emptyStart;
barArr[barArr.length - 1] = barArr[barArr.length - 1] == fullBar ? fullEnd : emptyEnd;
const bar = barArr.join(``);


data.result = bar + ` ${Math.floor((value*100)/maxValue)}%`
}
    return {
      code: d.util.setCode(data),
    };

  }
})

}

    }
      
module.exports = { 
Plugins 
  }
