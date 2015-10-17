/**
 * Check if the input is an array buffer view.
 */
export var isArrayBufferView: (ab: any) => ab is ArrayBufferView;
/**
 * Check if the input is an array buffer.
 * (Note: Must check if ab is null / an object first.)
 */
export var isArrayBuffer: (ab: any) => ab is ArrayBuffer;

if (typeof(ArrayBuffer) === 'undefined') {
  isArrayBufferView = (ab: any): ab is ArrayBufferView => false;
  isArrayBuffer = (ab: any): ab is ArrayBuffer => false;
} else {
  isArrayBuffer = function(ab: any): ab is ArrayBuffer {
    return typeof ab.byteLength === 'number';
  };
  if (ArrayBuffer['isView']) {
    isArrayBufferView = function(ab: any): ab is ArrayBufferView {
      return ArrayBuffer.isView(ab);
    };
  } else {
    isArrayBufferView = function(ab: any): ab is ArrayBufferView {
      return isArrayBuffer(ab['buffer']);
    }
  }
}