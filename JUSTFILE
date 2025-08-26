set unstable := true
set allow-duplicate-recipes := true
set allow-duplicate-variables := true

import '.just/const.just'
import '.just/version.just'
import '.just/bump.just'
import '.just/print.just'
import '.just/app_lib_link.just'
import '.just/app_lib_unlink.just'
import '.just/app.just'
import '.just/format_all_justfiles.just'
import '.just/home.just'

alias v := version
alias ui := hft_ui
alias api := hft_api

ROOT := justfile_directory()

_______________:
    just --list

[script('bash')]
check *args:
    COMMAND="deno check {{ args }}"

[script('bash')]
hft_api *args="":
    just app hft_api {{ args }}

[script('bash')]
hft_ui *args="":
    just app hft_ui {{ args }}

[script('bash')]
fmt:
    just format_all_justfiles
    just ui just fmt
    just api just fmt
