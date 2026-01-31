#!/usr/bin/expect -f

set timeout 300

cd [lindex $argv 0]

spawn leo deploy --network testnet --broadcast

expect {
    "Do you want to continue?" {
        send "y\r"
        exp_continue
    }
    "✅" {
        puts "\n✅ DEPLOYMENT SUCCESS!"
        exit 0
    }
    "Error" {
        puts "\n❌ DEPLOYMENT FAILED"
        exit 1
    }
    timeout {
        puts "\n⏱️  Timeout"
        exit 1
    }
    eof
}
