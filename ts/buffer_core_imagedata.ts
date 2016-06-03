import {BufferCoreCommon, default as BufferCore, BufferCoreImplementation} from './buffer_core';

/**
 * Deprecated type, so it is not present in TypeScript's lib.d.ts.
 */
interface CanvasPixelArray {
  // Values are [0,255].
  [index: number]: number;
  length: number;
}
declare var CanvasPixelArray: CanvasPixelArray;

/**
 * Implementation of BufferCore that is backed by an ImageData object.
 * Useful in browsers with HTML5 canvas support, but no TypedArray support
 * (IE9).
 */
export default class BufferCoreImageData extends BufferCoreCommon implements BufferCore {
  private static imageDataFactory: CanvasRenderingContext2D;
  /**
   * Constructs a CanvasPixelArray that represents the given amount of bytes.
   */
  private static getCanvasPixelArray(bytes: number): CanvasPixelArray {
    var ctx: CanvasRenderingContext2D = BufferCoreImageData.imageDataFactory;
    // Lazily initialize, otherwise every browser (even those that will never
    // use this code) will create a canvas on script load.
    if (ctx === undefined) {
      BufferCoreImageData.imageDataFactory = ctx = document.createElement('canvas').getContext('2d');
    }
    // You cannot create image data with size 0, so up it to size 1.
    if (bytes === 0) bytes = 1;
    return ctx.createImageData(Math.ceil(bytes / 4), 1).data;
  }
  public static isAvailable(): boolean {
    // Modern browsers have removed this deprecated API, so it is not always around.
    // NOTE: IE11 in IE8 compat. mode has CanvasPixelArray defined, but you can't
    // use it! Hence the check for getContext.
    return typeof(CanvasPixelArray) !== 'undefined' && document.createElement('canvas')['getContext'] !== undefined;
  }
  public static bufferType = "ImageData";

  private buff: CanvasPixelArray;
  private length: number;
  constructor(length: number) {
    super();
    this.length = length;
    this.buff = BufferCoreImageData.getCanvasPixelArray(length);
  }
  public getLength(): number {
    return this.length;
  }
  public writeUInt8(i: number, data: number): void {
    this.buff[i] = data;
  }
  public readUInt8(i: number): number {
    return this.buff[i];
  }
  public copy(start: number, end: number): BufferCore {
    // AFAIK, there's no efficient way to clone ImageData.
    var newBC = new BufferCoreImageData(end - start);
    for (var i = start; i < end; i++) {
      newBC.writeUInt8(i - start, this.buff[i]);
    }
    return newBC;
  }
}

// Type-check the class.
const _: BufferCoreImplementation = BufferCoreImageData;
