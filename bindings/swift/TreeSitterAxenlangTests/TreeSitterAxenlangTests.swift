import XCTest
import SwiftTreeSitter
import TreeSitterAxenlang

final class TreeSitterAxenlangTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_axenlang())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Axenlang grammar")
    }
}
