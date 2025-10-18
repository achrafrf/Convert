// components/ConverterModal.js
import JpgToPng from './converters/JpgToPng';
import WebpToPng from './converters/WebpToPng';
import JfifToPng from './converters/JfifToPng';
import PngToSvg from './converters/PngToSvg';
import HeicToJpg from './converters/HeicToJpg';
import HeicToPng from './converters/HeicToPng';
import WebpToJpg from './converters/WebpToJpg';
import SvgConverter from './converters/SvgConverter';
import ImageCompressor from './converters/ImageCompressor';
import PdfToWord from './converters/pdf/PdfToWord';
import PdfToJpg from './converters/pdf/PdfToJpg';
import JpgToPdf from './converters/pdf/JpgToPdf';
import DocxToPdf from './converters/documents/DocxToPdf';
import ImageToText from './converters/student-tools/ImageToText';
import MergePdf from './converters/pdf/MergePdf';
import VideoCutter from './converters/VideoCutter';
import ImageToIco from './converters/ImageToIco';
import HeicToPdf from './converters/documents/HeicToPdf ';
import WordToPdf from './converters/pdf/WordToPdf';
import PdfToEpub from './converters/pdf/PdfToEpub';
import EpubToPdf from './converters/pdf/EpubToPdf';


const ConverterModal = ({ activeTool, onClose }) => {
  const renderConverter = () => {
    switch (activeTool) {
      case 'jpg-to-png':
        return <JpgToPng onClose={onClose} />;
      case 'webp-to-png':
        return <WebpToPng onClose={onClose} />;
      case 'jfif-to-png':
        return <JfifToPng onClose={onClose} />;
      case 'png-to-svg':
        return <PngToSvg onClose={onClose} />;
      case 'heic-to-jpg':
        return <HeicToJpg onClose={onClose} />;
      case 'heic-to-png':
        return <HeicToPng onClose={onClose} />;
      case 'webp-to-jpg':
        return <WebpToJpg onClose={onClose} />;
      case 'svg-converter':
        return <SvgConverter onClose={onClose} />;
      case 'compress':
        return <ImageCompressor onClose={onClose} />;
      case 'pdf-to-word':
        return <PdfToWord onClose={onClose} />;
      case 'pdf-to-jpg':
        return <PdfToJpg onClose={onClose} />;
      case 'jpg-to-pdf':
        return <JpgToPdf onClose={onClose} />;
      case 'docx-to-pdf':
        return <DocxToPdf onClose={onClose} />;
         case 'WordToPdf':
        return <WordToPdf onClose={onClose} />;
      case 'heic-to-pdf':
        return <HeicToPdf onClose={onClose} />;
      case 'image-to-text':
        return <ImageToText onClose={onClose} />;
     case 'PdfToEpub':
        return <PdfToEpub onClose={onClose} />;
    case 'epub-to-pdf':
        return <EpubToPdf onClose={onClose} />;
        case 'merge-pdf':
  return <MergePdf onClose={onClose} />;
  case 'video-cutter':
  return <VideoCutter onClose={onClose} />;
   case 'Image-to-Ico':
  return <ImageToIco onClose={onClose} />;
   case 'HeicToPdf':
  return <HeicToPdf onClose={onClose} />;
      default:
        return null;
    }
  };

  return renderConverter();
};

export default ConverterModal;