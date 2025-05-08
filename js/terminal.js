// Terminal functionality
document.addEventListener('DOMContentLoaded', function() {
    const terminalInput = document.getElementById('terminal-input');
    const terminalHistory = document.getElementById('terminal-history');
    const terminalHelp = document.getElementById('terminal-help');
    
    if (!terminalInput || !terminalHistory) return;
    
    // Current directory state
    let currentDir = '~';
    
    // File system simulation
    const fileSystem = {
        '~': {
            type: 'dir',
            content: ['projects', 'tools', 'research', 'exploits', 'about.txt']
        },
        '~/projects': {
            type: 'dir',
            content: ['web_scanner.py', 'exploit_framework.c', 'fuzzer.go', 'README.md']
        },
        '~/tools': {
            type: 'dir',
            content: ['binary_analyzer.py', 'packet_inspector.go', 'memory_dumper.c']
        },
        '~/research': {
            type: 'dir',
            content: ['sandbox_escape.md', 'kernel_vulnerabilities.txt', 'browser_security.pdf']
        },
        '~/exploits': {
            type: 'dir',
            content: ['cve_2023_xxxx.py', 'buffer_overflow.c', 'use_after_free.cpp']
        },
        '~/about.txt': {
            type: 'file',
            content: 'Hi there! I\'m CyberwizD, focused on application security and exploit development. Feel free to explore my projects and research through this terminal interface or contact me for collaboration opportunities.'
        },
        '~/projects/README.md': {
            type: 'file',
            content: '# My Projects\n\nThis directory contains various security projects I\'ve been working on. Feel free to explore and learn from them.\n\n## Highlights\n\n- Web Scanner: Automated vulnerability scanner for web applications\n- Exploit Framework: Modular framework for developing custom exploits\n- Fuzzer: Intelligent fuzzing tool for finding memory corruption vulnerabilities'
        },
        '~/projects/web_scanner.py': {
            type: 'file',
            content: '#!/usr/bin/env python3\n\n"""\nAdvanced Web Application Vulnerability Scanner\n\nThis tool automatically scans web applications for common vulnerabilities\nincluding XSS, SQLi, CSRF, and more.\n"""\n\nimport requests\nimport argparse\nimport re\nfrom concurrent.futures import ThreadPoolExecutor\n\n# Scanner implementation...\n# (Code truncated for brevity)'
        }
    };
    
    // Command history
    let commandHistory = [];
    let historyIndex = -1;
    
    // Sound effects (optional)
    const keySound = new Audio();
    keySound.src = 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tAwAAAAAAAAAAAAAAAAAAAAABJbmZvAAAADwAAAAoAAAWgADAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQICAgICAgICAgICAgICAgICAgICAgICAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMP/wAARCAACAAoDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9sAQwACAgICAgIDAgIDBQMDAwUGBQUFBQYIBgYGBgYICggICAgICAoKCgoKCgoKDAwMDAwMDg4ODg4PDw8PDw8PDw8P/9sAQwECAgIEBAQHBAQHEAsJCxAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQ/90ABAAN/9oADAMBAAIRAxEAPwDRooor8LP77P/Z';
    keySound.volume = 0.2;
    
    // Command execution sound
    const execSound = new Audio();
    execSound.src = 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tAwAAAAAAAAAAAAAAAAAAAAABJbmZvAAAADwAAAAsAAAeAAC8vLy8vLy8vLy8vT09PT09PT09PT09vb29vb29vb29vb4+Pj4+Pj4+Pj4+Pj6+vr6+vr6+vr6+vz8/Pz8/Pz8/Pz8/v7+/v7+/v7+/v7////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAYRAAAAAAAAB6C3a8KGAAAA//tAxAAADVi1O9TMABGOIKN7M5AAAAAGkluS3/////+gAE3//JdVAAAAHSGjMLFjYigAABxDjT//////////4hs7kODQZHIcGw4Pg+OR///wi/4IMi8IEGBIhwIEORD/5EX//xAg0U9/+1DEBoAM0P817UygAaggIj2nmAA0gAICAP/0f9AgICdJ///oEBA0Tn//0CAgNnSf//QICAmyf//0CAgvC/AI8EQHAIBAeAQCAQCC+AQCf/oEBAIBAeAQCAQCC+AQD1/z/0CAgEAgPAIBAIBBfAIAGEQAAAAHoXDtPJbwAAAAP/7UsQEgAzU/TXtPKAB3hqmvamYAAAAAh4F3d3d5vkLt3d3d3aIADu7u7u8RiMQAHd3d3dpiMQAEIeRiHg8AEIeAgIeAgAIQhAQ8BAA9PT09PT0ADT09PT09PQAr+vr6+vr6ACv6+vr6+voBVVVVVVVVQFVVVVVVVVVAf//Z';
    execSound.volume = 0.15;
    
    // Handle command execution
    function executeCommand(command) {
        // Play execution sound
        try {
            execSound.currentTime = 0;
            execSound.play();
        } catch (e) {
            // Ignore audio errors
        }
        
        // Add command to history display
        const commandLine = document.createElement('div');
        commandLine.className = 'terminal-line';
        commandLine.innerHTML = `<span class="terminal-prompt">$</span> <span class="terminal-command">${command}</span>`;
        terminalHistory.appendChild(commandLine);
        
        // Process command
        const output = document.createElement('div');
        output.className = 'terminal-output';
        
        // Split command into parts
        const parts = command.trim().split(' ');
        const cmd = parts[0].toLowerCase();
        const args = parts.slice(1);
        
        // Handle different commands
        switch(cmd) {
            case 'help':
                terminalHelp.style.display = 'block';
                break;
                
            case 'clear':
                terminalHistory.innerHTML = '';
                return;
                
            case 'ls':
                let targetDir = currentDir;
                if (args.length > 0) {
                    targetDir = resolvePath(args[0]);
                }
                
                if (fileSystem[targetDir] && fileSystem[targetDir].type === 'dir') {
                    output.innerHTML = fileSystem[targetDir].content.map(item => {
                        const itemPath = `${targetDir}/${item}`;
                        if (fileSystem[itemPath] && fileSystem[itemPath].type === 'dir') {
                            return `<span class="highlight">${item}/</span>`;
                        }
                        return item;
                    }).join(' &nbsp; ');
                } else {
                    output.innerText = `ls: cannot access '${args[0]}': No such file or directory`;
                }
                break;
                
            case 'cd':
                if (args.length === 0 || args[0] === '~') {
                    currentDir = '~';
                    break;
                }
                
                const newPath = resolvePath(args[0]);
                
                if (fileSystem[newPath] && fileSystem[newPath].type === 'dir') {
                    currentDir = newPath;
                } else {
                    output.innerText = `cd: ${args[0]}: No such directory`;
                }
                break;
                
            case 'cat':
                if (args.length === 0) {
                    output.innerText = 'cat: missing file operand';
                    break;
                }
                
                const filePath = resolvePath(args[0]);
                
                if (fileSystem[filePath] && fileSystem[filePath].type === 'file') {
                    // Apply syntax highlighting for code files
                    if (filePath.endsWith('.py') || filePath.endsWith('.c') || filePath.endsWith('.go') || filePath.endsWith('.cpp')) {
                        output.innerHTML = applyCodeHighlighting(fileSystem[filePath].content, filePath);
                    } else if (filePath.endsWith('.md')) {
                        output.innerHTML = applyMarkdownHighlighting(fileSystem[filePath].content);
                    } else {
                        output.innerHTML = fileSystem[filePath].content.replace(/\n/g, '<br>');
                    }
                } else {
                    output.innerText = `cat: ${args[0]}: No such file`;
                }
                break;
                
            case 'projects':
                output.innerHTML = `
                    <strong class="highlight">Current Projects:</strong><br>
                    <br>
                    1. <span class="highlight">CyberSpace</span> - Web Application Vulnerability Scanner<br>
                    Advanced tool for detecting and reporting web vulnerabilities automatically.<br>
                    <br>
                    2. <span class="highlight">BinX</span> - Binary Analysis Framework<br>
                    Framework for analyzing binary files and identifying potential vulnerabilities.<br>
                    <br>
                    3. <span class="highlight">FuzzGen</span> - Intelligent Fuzzing Tool<br>
                    Next-generation fuzzing tool with machine learning capabilities.
                `;
                break;

            case 'whoami':
                output.innerHTML = `<span class="highlight">cyberwizd</span> - Application Security Specialist & Exploit Developer`;
                break;
                
            case 'date':
                output.innerText = new Date().toString();
                break;
                
            case 'echo':
                output.innerText = args.join(' ');
                break;
                
            case 'pwd':
                output.innerText = currentDir;
                break;
                
            default:
                if (cmd.trim() === '') {
                    return;
                }
                output.innerText = `${cmd}: command not found`;
        }
        
        // Add output to terminal
        if (output.innerHTML !== '') {
            terminalHistory.appendChild(output);
        }
        
        // Scroll to bottom
        terminalHistory.scrollTop = terminalHistory.scrollHeight;
    }
    
    // Helper function to resolve paths
    function resolvePath(path) {
        if (path.startsWith('/')) {
            return path;
        } else if (path.startsWith('~')) {
            return path;
        } else {
            return `${currentDir}/${path}`;
        }
    }
    
    // Very simple code highlighting function
    function applyCodeHighlighting(code, filePath) {
        // Determine language from file extension
        const ext = filePath.split('.').pop().toLowerCase();
        
        // Replace < and > to avoid HTML issues
        code = code.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        
        // Simple highlighting based on file type
        if (ext === 'py') {
            // Python highlighting
            code = code.replace(/(import|from|def|class|return|if|else|elif|for|while|try|except|with|as|in|not|and|or|True|False|None)/g, '<span style="color: #ff79c6;">$1</span>');
            code = code.replace(/("|')(.*?)(\1)/g, '<span style="color: #f1fa8c;">$1$2$3</span>');
            code = code.replace(/(#.*)$/gm, '<span style="color: #6272a4;">$1</span>');
        } else if (ext === 'c' || ext === 'cpp') {
            // C/C++ highlighting
            code = code.replace(/(int|char|void|float|double|struct|typedef|const|static|extern|return|if|else|for|while|do|switch|case|break|continue)/g, '<span style="color: #ff79c6;">$1</span>');
            code = code.replace(/("|')(.*?)(\1)/g, '<span style="color: #f1fa8c;">$1$2$3</span>');
            code = code.replace(/(\/\/.*$|\/\*[\s\S]*?\*\/)/gm, '<span style="color: #6272a4;">$1</span>');
        } else if (ext === 'go') {
            // Go highlighting
            code = code.replace(/(package|import|func|var|const|type|struct|interface|map|chan|go|defer|return|if|else|for|range|switch|case|break|continue)/g, '<span style="color: #ff79c6;">$1</span>');
            code = code.replace(/("|`)(.*?)(\1)/g, '<span style="color: #f1fa8c;">$1$2$3</span>');
            code = code.replace(/(\/\/.*$|\/\*[\s\S]*?\*\/)/gm, '<span style="color: #6272a4;">$1</span>');
        }
        
        return code.replace(/\n/g, '<br>');
    }
    
    // Simple markdown highlighting
    function applyMarkdownHighlighting(markdown) {
        // Replace < and > to avoid HTML issues
        markdown = markdown.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        
        // Headers
        markdown = markdown.replace(/^# (.*$)/gm, '<h1 style="color: #ff79c6;">$1</h1>');
        markdown = markdown.replace(/^## (.*$)/gm, '<h2 style="color: #ff79c6;">$1</h2>');
        markdown = markdown.replace(/^### (.*$)/gm, '<h3 style="color: #ff79c6;">$1</h3>');
        
        // Lists
        markdown = markdown.replace(/^- (.*$)/gm, '• <span style="color: #f1fa8c;">$1</span>');
        
        // Bold
        markdown = markdown.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // Italic
        markdown = markdown.replace(/\*(.*?)\*/g, '<em>$1</em>');
        
        // Code
        markdown = markdown.replace(/`(.*?)`/g, '<code style="background-color: rgba(0,0,0,0.2); padding: 2px 4px; border-radius: 3px;">$1</code>');
        
        return markdown.replace(/\n/g, '<br>');
    }
    
    // Handle input submission
    if (terminalInput) {
        terminalInput.addEventListener('keydown', function(e) {
            // Type sound effect
            try {
                keySound.currentTime = 0;
                keySound.play();
            } catch (e) {
                // Ignore audio errors
            }
            
            if (e.key === 'Enter') {
                const command = terminalInput.value.trim();
                
                if (command !== '') {
                    // Add to command history
                    commandHistory.push(command);
                    historyIndex = commandHistory.length;
                    
                    // Execute command
                    executeCommand(command);
                    
                    // Clear input
                    terminalInput.value = '';
                }
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                
                if (historyIndex > 0) {
                    historyIndex--;
                    terminalInput.value = commandHistory[historyIndex];
                    
                    // Move cursor to end
                    setTimeout(() => {
                        terminalInput.selectionStart = terminalInput.selectionEnd = terminalInput.value.length;
                    }, 0);
                }
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                
                if (historyIndex < commandHistory.length - 1) {
                    historyIndex++;
                    terminalInput.value = commandHistory[historyIndex];
                    
                    // Move cursor to end
                    setTimeout(() => {
                        terminalInput.selectionStart = terminalInput.selectionEnd = terminalInput.value.length;
                    }, 0);
                } else {
                    historyIndex = commandHistory.length;
                    terminalInput.value = '';
                }
            } else if (e.key === 'Tab') {
                e.preventDefault();
                
                // Simple tab completion for commands and file paths
                const currentInput = terminalInput.value;
                const parts = currentInput.split(' ');
                
                if (parts.length === 1) {
                    // Command completion
                    const cmd = parts[0].toLowerCase();
                    
                    const commands = ['help', 'clear', 'ls', 'cd', 'cat', 'projects', 'whoami', 'date', 'echo', 'pwd'];
                    
                    const matches = commands.filter(c => c.startsWith(cmd));
                    
                    if (matches.length === 1) {
                        terminalInput.value = matches[0];
                    }
                } else if (parts.length === 2) {
                    // Path completion for second argument
                    const cmd = parts[0].toLowerCase();
                    const path = parts[1];
                    
                    if (['cd', 'ls', 'cat'].includes(cmd)) {
                        let targetDir = currentDir;
                        const lastSlashIndex = path.lastIndexOf('/');
                        
                        if (lastSlashIndex !== -1) {
                            const dirPath = path.substring(0, lastSlashIndex + 1);
                            const partialFile = path.substring(lastSlashIndex + 1);
                            
                            // Resolve the directory path
                            if (dirPath.startsWith('/') || dirPath.startsWith('~')) {
                                targetDir = dirPath.substring(0, dirPath.length - 1);
                            } else {
                                targetDir = `${currentDir}/${dirPath}`.substring(0, `${currentDir}/${dirPath}`.length - 1);
                            }
                            
                            // Get files in that directory
                            if (fileSystem[targetDir] && fileSystem[targetDir].type === 'dir') {
                                const files = fileSystem[targetDir].content;
                                const matches = files.filter(f => f.startsWith(partialFile));
                                
                                if (matches.length === 1) {
                                    terminalInput.value = `${parts[0]} ${dirPath}${matches[0]}`;
                                }
                            }
                        } else {
                            // No slash, just the start of a filename in current dir
                            if (fileSystem[currentDir] && fileSystem[currentDir].type === 'dir') {
                                const files = fileSystem[currentDir].content;
                                const matches = files.filter(f => f.startsWith(path));
                                
                                if (matches.length === 1) {
                                    terminalInput.value = `${parts[0]} ${matches[0]}`;
                                }
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Initial focus
    // if (terminalInput) {
    //     terminalInput.focus();
        
    //     // Focus on terminal when clicking anywhere in the terminal window
    //     document.querySelector('.terminal-window').addEventListener('click', function() {
    //         terminalInput.focus();
    //     });
    // }
});