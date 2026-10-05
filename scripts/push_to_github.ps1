Add-Type -TypeDefinition @"
using System;
using System.Runtime.InteropServices;
using System.Text;

public class CredManager {
    [DllImport("advapi32.dll", EntryPoint = "CredReadW", CharSet = CharSet.Unicode, SetLastError = true)]
    public static extern bool CredRead(string target, int type, int reservedFlag, out IntPtr credentialPtr);

    [DllImport("advapi32.dll", EntryPoint = "CredFree", SetLastError = true)]
    public static extern void CredFree(IntPtr buffer);

    [StructLayout(LayoutKind.Sequential, CharSet = CharSet.Unicode)]
    public struct CREDENTIAL {
        public int Flags;
        public int Type;
        public string TargetName;
        public string Comment;
        public long LastWritten;
        public int CredentialBlobSize;
        public IntPtr CredentialBlob;
        public int Persist;
        public int AttributeCount;
        public IntPtr Attributes;
        public string TargetAlias;
        public string UserName;
    }

    public static string GetPassword(string target) {
        IntPtr credPtr;
        if (CredRead(target, 1, 0, out credPtr)) {
            var cred = (CREDENTIAL)Marshal.PtrToStructure(credPtr, typeof(CREDENTIAL));
            byte[] bytes = new byte[cred.CredentialBlobSize];
            Marshal.Copy(cred.CredentialBlob, bytes, 0, cred.CredentialBlobSize);
            CredFree(credPtr);
            return Encoding.UTF8.GetString(bytes);
        }
        return null;
    }
}
"@

$targets = @(
    "GitHub - https://api.github.com/mahmudul-hasan12",
    "git:https://github.com",
    "LegacyGeneric:target=GitHub - https://api.github.com/mahmudul-hasan12"
)

foreach ($target in $targets) {
    $token = [CredManager]::GetPassword($target)
    if ($token) {
        Write-Output "Found token for target: $target (length: $($token.Length))"
        # Test push using token in remote URL
        $cleanToken = $token.Trim([char]0, "`r", "`n", " ")
        $url = "https://mahmudul-hasan12:$cleanToken@github.com/mahmudul-hasan12/SOURCE.git"
        Set-Location "C:\Users\TAWHID TOPON\Documents\google\SOURCE"
        & "C:\Users\TAWHID TOPON\AppData\Local\GitHubDesktop\app-3.6.6\resources\app\git\cmd\git.exe" push $url main
        exit 0
    }
}

Write-Output "No token found in generic credentials list."
