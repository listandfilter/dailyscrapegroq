import fs from 'fs/promises';

export async function joinCSVFiles(file1, file2, outputFile) {
  try {
   
    const [data1, data2] = await Promise.all([
      fs.readFile(file1, 'utf8'),
      fs.readFile(file2, 'utf8')
    ]);

 
    const lines1 = data1.trim().split('\n');
    const lines2 = data2.trim().split('\n');

    const lines2WithoutHeader = lines2.slice(1);
    const joinedLines = [...lines1, ...lines2WithoutHeader];


    await fs.writeFile(outputFile, joinedLines.join('\n'), 'utf8');

    console.log(`✅ Joined CSV saved to ${outputFile}`);
  } catch (err) {
    console.error('❌ Error joining CSV files:', err);
    throw err;
  }
}
