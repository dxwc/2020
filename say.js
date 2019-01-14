global.previous_length = 0;

function stdout_write(text)
{
    process.stdout.write
    (
        ' '.repeat(global.previous_length ? previous_length : text.length) + '\r'
    );

    global.previous_length = text.length;
    process.stdout.write(text + '\r');
}

function clean_say_dont_replace(text, err)
{
    process.stdout.write
    (
        ' '.repeat(global.previous_length ? previous_length : text.length) + '\r'
    );

    if(!err) console.info(text);
    else     console.info(err);
}

module.exports.stdout_write = stdout_write;
module.exports.clean_say_dont_replace = clean_say_dont_replace;