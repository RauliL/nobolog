" Vim syntax file
" Language: Nobolog
" Maintainer: Rauli Laine
" Last Change: 2022 Jan 16

if !exists("main_syntax")
  " Quit if a syntax file has already been loaded.
  if exists("b:current_syntax")
    finish
  endif
  let main_syntax = "nobolog"
elseif exists("b:current_syntax") && b:current_syntax == "nobolog"
  finish
endif

" Syntax: Comments
syn keyword nobologTodo contained TODO FIXME XXX NOTE
syn match nobologSharpBang "\%^#!.*" display
syn match nobologComment "#.*$" contains=nobologTodo,nobologSharpBang

" Syntax: String literals
syn region nobologString start=/"/ end=/"/ contains=nobologStringEscape
syn region nobologString start=/'/ end=/'/ contains=nobologStringEscape
syn match nobologStringEscape "\\["'\\/btnfr]" contained
syn match nobologStringEscape "\\u\x\{4}" contained

" Syntax: Number literals
syn match nobologNumber "\%([-+]\)\=\d\+\%([\d_]\+\)\=\%(\.\%([0-9_]\)\+\)\=\%([eE][+-]\=\d\+\)\="

" Syntax: Queries
syn match nobologQuery "?-.*\." contains=nobologNumber,nobologString,nobologVariable

" Syntax: Variables
syn match nobologVariable "\%([A-Z_]\)\%([a-z0-9_]\+\)\="

" Syntax: Separators
syn match nobologSeparator "\%(;\|,\|\.\|(\|)\|\[\|]\|?-\|:-\)"

" Syntax: Operators
syn match nobologOperator "\%(+\|-\|*\|/\|==\|!=\|<\|>\|<=\|>=\|!\|=\)"

hi def link nobologTodo Todo
hi def link nobologSharpBang PreProc
hi def link nobologComment Comment
hi def link nobologQuery PreProc
hi def link nobologNumber Number
hi def link nobologStringEscape Special
hi def link nobologString String
hi def link nobologVariable Identifier
hi def link nobologSeparator Operator
hi def link nobologOperator Operator

let b:current_syntax = "nobolog"
if main_syntax == "nobolog"
  unlet main_syntax
endif
