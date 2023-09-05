using System;
using System.IO;
using System.IO.Compression;
using System.Runtime.InteropServices.JavaScript;

namespace Compressy;
public partial class Compressor
{

	public static void Main(string[] args)
	{
		
	}

	[JSExport]
	internal static byte[] GzipCompress(byte[] data)
	{
		try
		{
			using var compressedStream = new MemoryStream();
			using (var gzipStream = new GZipStream(compressedStream, CompressionMode.Compress))
			{
				gzipStream.Write(data);
			}

			return compressedStream.ToArray();
		}
		catch (Exception e)
		{
			Console.WriteLine(e.ToString());
		}

		return Array.Empty<byte>();
	}
}