"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CompressionOptions {
    constructor(algorithm, version) {
        this.algorithm = algorithm;
        this.version = version;
        this.chunkLengthInKBValue = undefined;
        this.crcCheckChanceValue = undefined;
    }
    static get ALGORITHMS() {
        return {
            NONE: '',
            LZ4: 'LZ4Compressor',
            SNAPPY: 'SnappyCompressor',
            DEFLATE: 'DeflateCompressor',
        };
    }
    chunkLengthKb(chunkLengthInKB) {
        // tslint:disable-next-line
        if ((chunkLengthInKB & (chunkLengthInKB - 1)) !== 0) {
            // eslint-disable-line no-bitwise
            throw new Error('Compression chunk length must be a valid power of 2.');
        }
        this.chunkLengthInKBValue = chunkLengthInKB;
        return this;
    }
    crcCheckChance(crcCheckChance) {
        this.crcCheckChanceValue = crcCheckChance;
        return this;
    }
    build() {
        // compression disabled
        if (this.algorithm === CompressionOptions.ALGORITHMS.NONE) {
            if (this.version.isV3x()) {
                return '{ \'enabled\': false }';
            }
            return '{ \'sstable_compression\' : \'\' }';
        }
        // compression enabled
        const compressionKeyword = this.version.isV3x()
            ? 'class'
            : 'sstable_compression';
        const options = [`'${compressionKeyword}': '${this.algorithm}'`];
        if (this.chunkLengthInKBValue !== undefined) {
            options.push(`'chunk_length_kb' : ${this.chunkLengthInKBValue}`);
        }
        if (this.crcCheckChanceValue !== undefined) {
            options.push(`'crc_check_chance' : ${this.crcCheckChanceValue}`);
        }
        return `{ ${options.join(', ')} }`;
    }
}
exports.default = CompressionOptions;
//# sourceMappingURL=CompressionOptions.js.map