{
  "targets": [
    {
      "target_name": "matrix",
      "sources": [
        "src/addon.cc"
      ],
      'cflags!': [ '-fno-exceptions', '-Wformat=2', '-Werror', '-Wsign-compare'],
      'cflags_cc!': [ '-fno-exceptions', '-Wformat=2', '-Werror', '-Wsign-compare'],
      'conditions': [
        ['OS=="mac"', {
          'xcode_settings': {
            'GCC_ENABLE_CPP_EXCEPTIONS': 'YES',
            'MACOSX_DEPLOYMENT_TARGET': '10.9'
          }
        }]
      ]
    }
  ]
}