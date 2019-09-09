
function Calculate(files)
{
    console.log(files)

    Array.from(files).forEach(file => {

        var reader = new FileReader();
        reader.readAsArrayBuffer(file)
        var result = reader.result

        readExcelFile(result)
    })

}

function readExcelFile(file)
{
    console.log(file)
}